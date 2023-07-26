import logging


class Logger:
    def __init__(self, signature=None):
        self.meta_str = ""
        self.signature = signature
        self.logger = logging.getLogger("DEBUG_LOGGER_DJANGO")

    def set_meta(self, **kwargs):
        meta = []
        for key, value in kwargs.items():
            meta.append("{}({})".format(key, value))

        self.meta_str = " ".join(meta)
        return self

    def _create_log_msg(self, label="", message=""):
        return "{} {} {} {}".format(self.signature, self.meta_str, label, str(message or ""))

    def debug(self, label=None, message=None):
        self.logger.info(self._create_log_msg(label, message))

    def info(self, label=None, message=None):
        self.logger.info(self._create_log_msg(label, message))

    def error(self, label=None, message=None):
        self.logger.error(self._create_log_msg(label, message))

    def exception(self, label=None, message=None):
        self.logger.exception(self._create_log_msg(label, message))