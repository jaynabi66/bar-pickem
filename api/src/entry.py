"""

 OMRChecker

 Author: Udayraj Deshmukh
 Github: https://github.com/Udayraj123

"""
import cv2
import numpy as np

from src.template import Template
from src.utils.file import setup_outputs_for_template
from src.utils.parsing import get_concatenated_response, open_config_with_defaults


def entry_point(file_buffer):
    return process_dir(file_buffer)


def process_dir(file_buffer):
    # Update local tuning_config
    tuning_config = open_config_with_defaults()

    # Update local template
    template = Template(tuning_config)

    outputs_namespace = setup_outputs_for_template(template)

    return process_files(
        file_buffer,
        template,
        tuning_config,
        outputs_namespace,
    )


def process_files(
    omr_buffer,
    template,
    tuning_config,
    outputs_namespace,
):
    in_omr = cv2.imdecode(np.frombuffer(omr_buffer, np.uint8), cv2.IMREAD_GRAYSCALE)
    in_omr = template.image_instance_ops.apply_preprocessors(
        in_omr, template
    )

    results_dict = {}
    image_buffer = None
    if in_omr is None:
        # Error OMR case
        err_line = ["NA"] + outputs_namespace.empty_resp
        results_dict = dict(zip(outputs_namespace.sheetCols, err_line))
    else:
        # uniquify
        (
            response_dict,
            image,
        ) = template.image_instance_ops.read_omr_response(
            template, image=in_omr
        )

        # TODO: move inner try catch here
        # concatenate roll nos, set unmarked responses, etc
        omr_response = get_concatenated_response(response_dict, template)

        score = 0

        # TODO J: Create an array of the OMR responses.
        resp_array = []
        for k in template.output_columns:
            resp_array.append(omr_response[k])

        # TODO J: Create the results.
        results_line = [score] + resp_array

        if (len(results_line) != len(outputs_namespace.sheetCols)):
            raise Exception(f"Results has length of {len(results_line)}, which is not equal to the expected {len(output_columns.sheetCols)}")
        results_dict = dict(zip(outputs_namespace.sheetCols, results_line))

        (ok, encoded_image) = cv2.imencode(".png", image)
        if not ok:
            raise Exception("Output image failed to encode")
        image_buffer = encoded_image.tobytes()

    return ( results_dict, image_buffer )
