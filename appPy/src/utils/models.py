from .errors import AppException


def get_model_by_name(supported_models, model_name):
    """Pick a model by its name, case-insensitive."""
    supported_model_names = [model.name for model in supported_models]
    supported_model_names_lcase = [name.lower() for name in supported_model_names]

    if not model_name.lower() in supported_model_names_lcase:
        csv = ', '.join(supported_model_names)
        raise AppException(f'Unknown model {model_name}.\nAvailable models: {csv}')

    return supported_models[supported_model_names_lcase.index(model_name.lower())]
