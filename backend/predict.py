import json
import torch
import torch.nn as nn
import numpy as np

from torchvision import models, transforms
from PIL import Image

from services.groq_service import get_disease_info



# ==========================
# Load Class Names
# ==========================

with open("class_names.json", "r") as f:
    class_names = json.load(f)


NUM_CLASSES = len(class_names)



# ==========================
# Load Disease Model
# ==========================

model = models.resnet18(weights=None)


model.fc = nn.Linear(
    model.fc.in_features,
    NUM_CLASSES
)


model.load_state_dict(
    torch.load(
        "plant_resnet18_weights.pth",
        map_location="cpu"
    )
)


model.eval()



# ==========================
# Image Transform
# ==========================

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])



# ==========================
# Leaf Detection
# ==========================

def is_leaf_image(image):

    img = np.array(image)

    r = img[:,:,0]
    g = img[:,:,1]
    b = img[:,:,2]


    green_pixels = (
        (g > r * 1.1) &
        (g > b * 1.1)
    )


    green_ratio = green_pixels.mean()


    print(
        "Green ratio:",
        green_ratio
    )


    return green_ratio > 0.05




# ==========================
# Prediction Function
# ==========================

def predict(image_path):


    image = Image.open(
        image_path
    ).convert("RGB")



    # ==========================
    # Reject Non Leaf Images
    # ==========================

    if not is_leaf_image(image):

        return {

            "plant":
            "Unknown",

            "disease":
            "No leaf detected",

            "confidence":
            0,

            "severity":
            "Invalid image",

            "description":
            "Please upload a clear plant leaf image.",

            "symptoms":
            "",

            "treatment":
            "",

            "prevention":
            ""

        }




    # ==========================
    # Disease Prediction
    # ==========================


    img = transform(
        image
    )


    img = img.unsqueeze(0)



    with torch.no_grad():

        output = model(
            img
        )


        probabilities = torch.softmax(
            output,
            dim=1
        )


        confidence, index = torch.max(
            probabilities,
            dim=1
        )



    confidence_score = confidence.item() * 100



    label = class_names[
        index.item()
    ]



    # ==========================
    # Extract Disease
    # ==========================


    if "___" in label:

        plant, disease = label.split(
            "___",
            1
        )

    else:

        plant = "Unknown"
        disease = label



    plant = plant.replace(
        "_",
        " "
    )


    disease = disease.replace(
        "_",
        " "
    )



    # ==========================
    # Confidence
    # ==========================


    if confidence_score >= 80:

        severity = "High confidence"

    elif confidence_score >= 50:

        severity = "Medium confidence"

    else:

        severity = "Low confidence"



    # ==========================
    # Groq Information
    # ==========================


    try:

        info = get_disease_info(
            plant,
            disease
        )


        print(
            "========== GROQ RESPONSE =========="
        )

        print(info)

        print(
            "===================================="
        )


    except Exception as e:

        print(
            "GROQ ERROR:",
            e
        )


        info = {

            "description":
            "AI information unavailable.",

            "symptoms":
            "No symptoms available.",

            "treatment":
            "No treatment available.",

            "prevention":
            "No prevention available."

        }




    # ==========================
    # Final Response
    # ==========================


    return {


        "plant":
        plant,


        "disease":
        disease,


        "confidence":
        round(
            confidence_score,
            2
        ),


        "severity":
        severity,


        "description":
        info.get(
            "description",
            "AI information unavailable."
        ),


        "symptoms":
        info.get(
            "symptoms",
            "No symptoms available."
        ),


        "treatment":
        info.get(
            "treatment",
            "No treatment available."
        ),


        "prevention":
        info.get(
            "prevention",
            "No prevention available."
        )

    }