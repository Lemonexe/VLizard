from .antoine import antoine_model, antoine_ext_model
from .wagner import wagner_model

# supported models in order of preference, descending
supported_models = [wagner_model, antoine_ext_model, antoine_model]
