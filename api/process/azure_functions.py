"""
Azure Function HTTP Trigger for OMRChecker
Exposes entry_point_for_args as a REST API endpoint
"""

import azure.functions as func
import io
import json
import base64
from pathlib import Path

from src.entry import entry_point


def process_image(file_buffer: bytes) -> dict:
    """
    Process OMR image and return results.

    Returns:
        Dictionary with results and image buffer
    """
    results_dict, image_buffer = entry_point(file_buffer)
    image_base64 = base64.b64encode(image_buffer).decode("ascii")

    return {
        "status": "success",
        "results": results_dict,
        "image_base64": image_base64
    }


def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    HTTP function that processes an image (as byte array).
        
    Returns:
        JSON response with results
    """
    try:
        # Parse the data
        file_buffer: bytes
        try:
            file_buffer = req.get_body()
        except ValueError:
            return func.HttpResponse(
                body=json.dumps({
                    "error": "No request body was included.",
                    "status": "failed"
                }),
                status_code=400,
                mimetype="application/json"
            )

        # Get the uploaded file (as byte array)
        if not file_buffer:
            return func.HttpResponse(
                body=json.dumps({
                    "error": "The json body did not include a byte-array 'file' in the json body.",
                    "status": "failed"
                }),
                status_code=400,
                mimetype="application/json"
            )
                
        # Process the image with config
        try:
            response_data = process_image(file_buffer)
        except Exception as e:
            raise Exception(f"Error processing: {e}")
        
        # Return the response
        return func.HttpResponse(
            body=json.dumps(response_data),
            status_code=200,
            mimetype="application/json"
        )        
    except Exception as e:
        # Handle exceptions
        return func.HttpResponse(
            body=json.dumps({
                "error": f"Error processing image: {str(e)}",
                "status": "failed"
            }),
            status_code=500,
            mimetype="application/json"
        )
