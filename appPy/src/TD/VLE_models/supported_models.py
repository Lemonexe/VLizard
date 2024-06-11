from .NRTL import NRTL_model, NRTL10_model
from .margules import margules_model
from .van_Laar import van_Laar_model

# supported models in order of preference, descending
supported_models = [NRTL_model, NRTL10_model, van_Laar_model, margules_model]
