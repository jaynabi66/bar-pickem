"""

 OMRChecker

 Author: Udayraj Deshmukh
 Github: https://github.com/Udayraj123

"""

import argparse
import io
import os
from pathlib import Path

from src.entry import entry_point


# TODO J: Parses the command line arguments. This needs to be replaced.
def parse_args():
    # construct the argument parse and parse the arguments
    argparser = argparse.ArgumentParser()

    argparser.add_argument(
        "-i",
        "--inputFile",
        required=True,
        type=str,
        dest="input_file",
        help="Specify an input image file path.",
    )

    (
        args,
        unknown,
    ) = argparser.parse_known_args()

    args = vars(args)

    if len(unknown) > 0:
        argparser.print_help()
        exit(11)
    return args


def entry_point_for_args(args):
    input_file = args["input_file"]
    input_path = Path(input_file)
    if not os.path.isfile(input_path):
        raise Exception(f"Given input file does not exist: '{input_path}'")
    file_buffer = file_as_bytes(input_path)
    (results_dict, image_buffer) = entry_point(file_buffer)
    print(f"RESULTS: {results_dict}")


def file_as_bytes(input_file):
    try:
        with open(input_file, "rb") as f:
            file_content = f.read()
            buffer = io.BytesIO(file_content)
            buffer.seek(0)
            return buffer.read()
    except FileNotFoundError:
        raise Exception(f"{input_file} was not found.")


# TODO J: Primary function called by the python command. Runs the entire program. This needs to be replaced.
if __name__ == "__main__":
    args = parse_args()
    entry_point_for_args(args)
