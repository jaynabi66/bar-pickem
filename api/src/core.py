import cv2
import numpy as np

import src.constants as constants
from src.utils.image import CLAHE_HELPER, ImageUtils


class ImageInstanceOps:
    """Class to hold fine-tuned utilities for a group of images. One instance for each processing directory."""

    def __init__(self, tuning_config):
        super().__init__()
        self.tuning_config = tuning_config

    def apply_preprocessors(self, in_omr, template):
        tuning_config = self.tuning_config
        # resize to conform to template
        in_omr = ImageUtils.resize_util(
            in_omr,
            tuning_config.dimensions.processing_width,
            tuning_config.dimensions.processing_height,
        )

        # run pre_processors in sequence
        for pre_processor in template.pre_processors:
            in_omr = pre_processor.apply_filter(in_omr)
        return in_omr

    def read_omr_response(self, template, image):
        config = self.tuning_config
        auto_align = config.alignment_params.auto_align
        try:
            img = image.copy()
            img = ImageUtils.resize_util(
                img, template.page_dimensions[0], template.page_dimensions[1]
            )
            if img.max() > img.min():
                img = ImageUtils.normalize_util(img)
            # Processing copies
            transp_layer = img.copy()
            final_marked = img.copy()

            morph = img.copy()

            if auto_align:
                # Note: clahe is good for morphology, bad for thresholding
                morph = CLAHE_HELPER.apply(morph)
                # Remove shadows further, make columns/boxes darker (less gamma)
                morph = ImageUtils.adjust_gamma(
                    morph, config.threshold_params.GAMMA_LOW
                )
                # TODO: all numbers should come from either constants or config
                _, morph = cv2.threshold(morph, 220, 220, cv2.THRESH_TRUNC)
                morph = ImageUtils.normalize_util(morph)

            # Move them to data class if needed
            # Overlay Transparencies
            alpha = 0.65
            omr_response = {}

            # Find Shifts for the field_blocks --> Before calculating threshold!
            if auto_align:
                # Open : erode then dilate
                v_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 10))
                morph_v = cv2.morphologyEx(
                    morph, cv2.MORPH_OPEN, v_kernel, iterations=3
                )
                _, morph_v = cv2.threshold(morph_v, 200, 200, cv2.THRESH_TRUNC)
                morph_v = 255 - ImageUtils.normalize_util(morph_v)

                morph_thr = 60  # for Mobile images, 40 for scanned Images
                _, morph_v = cv2.threshold(morph_v, morph_thr, 255, cv2.THRESH_BINARY)
                # kernel best tuned to 5x5 now
                morph_v = cv2.erode(morph_v, np.ones((5, 5), np.uint8), iterations=2)

                # template relative alignment code
                for field_block in template.field_blocks:
                    s, d = field_block.origin, field_block.dimensions

                    match_col, max_steps, align_stride, thk = map(
                        config.alignment_params.get,
                        [
                            "match_col",
                            "max_steps",
                            "stride",
                            "thickness",
                        ],
                    )
                    shift, steps = 0, 0
                    while steps < max_steps:
                        left_mean = np.mean(
                            morph_v[
                                s[1] : s[1] + d[1],
                                s[0] + shift - thk : -thk + s[0] + shift + match_col,
                            ]
                        )
                        right_mean = np.mean(
                            morph_v[
                                s[1] : s[1] + d[1],
                                s[0]
                                + shift
                                - match_col
                                + d[0]
                                + thk : thk
                                + s[0]
                                + shift
                                + d[0],
                            ]
                        )

                        left_shift, right_shift = left_mean > 100, right_mean > 100
                        if left_shift:
                            if right_shift:
                                break
                            else:
                                shift -= align_stride
                        else:
                            if right_shift:
                                shift += align_stride
                            else:
                                break
                        steps += 1

                    field_block.shift = shift

            # Get mean bubbleValues n other stats
            all_q_vals, all_q_strip_arrs, all_q_std_vals = [], [], []
            for field_block in template.field_blocks:
                box_w, box_h = field_block.bubble_dimensions
                q_std_vals = []
                for field_block_bubbles in field_block.traverse_bubbles:
                    q_strip_vals = []
                    for pt in field_block_bubbles:
                        # shifted
                        x, y = (pt.x + field_block.shift, pt.y)
                        rect = [y, y + box_h, x, x + box_w]
                        q_strip_vals.append(
                            cv2.mean(img[rect[0] : rect[1], rect[2] : rect[3]])[0]
                        )
                    q_std_vals.append(round(np.std(q_strip_vals), 2))
                    all_q_strip_arrs.append(q_strip_vals)
                    all_q_vals.extend(q_strip_vals)
                all_q_std_vals.extend(q_std_vals)

            global_std_thresh = self.get_global_threshold(all_q_std_vals)

            global_thr = self.get_global_threshold(all_q_vals, looseness=4)

            total_q_strip_no, total_q_box_no = 0, 0
            for field_block in template.field_blocks:
                box_w, box_h = field_block.bubble_dimensions
                for field_block_bubbles in field_block.traverse_bubbles:
                    # All Black or All White case
                    no_outliers = all_q_std_vals[total_q_strip_no] < global_std_thresh
                    per_q_strip_threshold = self.get_local_threshold(
                        all_q_strip_arrs[total_q_strip_no],
                        global_thr,
                        no_outliers,
                    )

                    # TODO: get rid of total_q_box_no
                    detected_bubbles = []
                    for bubble in field_block_bubbles:
                        bubble_is_marked = (
                            per_q_strip_threshold > all_q_vals[total_q_box_no]
                        )
                        total_q_box_no += 1
                        if bubble_is_marked:
                            detected_bubbles.append(bubble)
                            x, y, field_value = (
                                bubble.x + field_block.shift,
                                bubble.y,
                                bubble.field_value,
                            )
                            cv2.rectangle(
                                final_marked,
                                (int(x + box_w / 12), int(y + box_h / 12)),
                                (
                                    int(x + box_w - box_w / 12),
                                    int(y + box_h - box_h / 12),
                                ),
                                constants.CLR_DARK_GRAY,
                                3,
                            )

                            cv2.putText(
                                final_marked,
                                str(field_value),
                                (x, y),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                constants.TEXT_SIZE,
                                (20, 20, 10),
                                int(1 + 3.5 * constants.TEXT_SIZE),
                            )
                        else:
                            cv2.rectangle(
                                final_marked,
                                (int(x + box_w / 10), int(y + box_h / 10)),
                                (
                                    int(x + box_w - box_w / 10),
                                    int(y + box_h - box_h / 10),
                                ),
                                constants.CLR_GRAY,
                                -1,
                            )

                    for bubble in detected_bubbles:
                        field_label, field_value = (
                            bubble.field_label,
                            bubble.field_value,
                        )
                        # Only send rolls multi-marked in the directory
                        multi_marked_local = field_label in omr_response
                        omr_response[field_label] = (
                            (omr_response[field_label] + field_value)
                            if multi_marked_local
                            else field_value
                        )

                    if len(detected_bubbles) == 0:
                        field_label = field_block_bubbles[0].field_label
                        omr_response[field_label] = field_block.empty_val

                    total_q_strip_no += 1
                # /for field_block

            # Translucent
            cv2.addWeighted(
                final_marked, alpha, transp_layer, 1 - alpha, 0, final_marked
            )

            return omr_response, final_marked
        except Exception as e:
            raise e

    def get_global_threshold(self, q_vals_orig, looseness=1):
        """
        Note: Cannot assume qStrip has only-gray or only-white bg
            (in which case there is only one jump).
        So there will be either 1 or 2 jumps.
        1 Jump :
                ......
                ||||||
                ||||||  <-- risky THR
                ||||||  <-- safe THR
            ....||||||
            ||||||||||

        2 Jumps :
                ......
                |||||| <-- wrong THR
            ....||||||
            |||||||||| <-- safe THR
            ..||||||||||
            ||||||||||||

        The abstract "First LARGE GAP" is perfect for this.
        Current code is considering ONLY TOP 2 jumps(>= MIN_GAP) to be big,
            gives the smaller one

        """
        config = self.tuning_config
        PAGE_TYPE_FOR_THRESHOLD, MIN_JUMP = map(
            config.threshold_params.get,
            [
                "PAGE_TYPE_FOR_THRESHOLD",
                "MIN_JUMP",
            ],
        )

        global_default_threshold = (
            constants.GLOBAL_PAGE_THRESHOLD_WHITE
            if PAGE_TYPE_FOR_THRESHOLD == "white"
            else constants.GLOBAL_PAGE_THRESHOLD_BLACK
        )

        # Sort the Q bubbleValues
        q_vals = sorted(q_vals_orig)
        # Find the FIRST LARGE GAP and set it as threshold:
        ls = (looseness + 1) // 2
        l = len(q_vals) - ls
        max1, thr1 = MIN_JUMP, global_default_threshold
        for i in range(ls, l):
            jump = q_vals[i + ls] - q_vals[i - ls]
            if jump > max1:
                max1 = jump
                thr1 = q_vals[i - ls] + jump / 2

        return thr1

    def get_local_threshold(self, q_vals, global_thr, no_outliers):
        """
        TODO: Update this documentation too-
        //No more - Assumption : Colwise background color is uniformly gray or white,
                but not alternating. In this case there is atmost one jump.

        0 Jump :
                        <-- safe THR?
            .......
            ...|||||||
            ||||||||||  <-- safe THR?
        // How to decide given range is above or below gray?
            -> global q_vals shall absolutely help here. Just run same function
                on total q_vals instead of colwise _//
        How to decide it is this case of 0 jumps

        1 Jump :
                ......
                ||||||
                ||||||  <-- risky THR
                ||||||  <-- safe THR
            ....||||||
            ||||||||||

        """
        config = self.tuning_config
        # Sort the Q bubbleValues
        q_vals = sorted(q_vals)

        # Small no of pts cases:
        # base case: 1 or 2 pts
        if len(q_vals) < 3:
            thr1 = (
                global_thr
                if np.max(q_vals) - np.min(q_vals) < config.threshold_params.MIN_GAP
                else np.mean(q_vals)
            )
        else:
            # Find the LARGEST GAP and set it as threshold: //(FIRST LARGE GAP)
            l = len(q_vals) - 1
            max1, thr1 = config.threshold_params.MIN_JUMP, 255
            for i in range(1, l):
                jump = q_vals[i + 1] - q_vals[i - 1]
                if jump > max1:
                    max1 = jump
                    thr1 = q_vals[i - 1] + jump / 2

            confident_jump = (
                config.threshold_params.MIN_JUMP
                + config.threshold_params.CONFIDENT_SURPLUS
            )
            # If not confident, then only take help of global_thr
            if max1 < confident_jump:
                if no_outliers:
                    # All Black or All White case
                    thr1 = global_thr
                else:
                    # TODO: Low confidence parameters here
                    pass

        return thr1
