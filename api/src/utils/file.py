import argparse


# TODO J: Sets up output paths for the code. This looks like it can be removed.
def setup_outputs_for_template(template):
    # TODO: consider moving this into a class instance
    ns = argparse.Namespace()

    # TODO J: Defines the empty response.
    ns.empty_resp = [""] * len(template.output_columns)
    # TODO J: Sets the response.
    ns.sheetCols = [
        "score",
    ] + template.output_columns

    return ns
