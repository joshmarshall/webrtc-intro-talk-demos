import json
import os
from tornado.ioloop import IOLoop
from tornado.web import Application, RequestHandler
from tornado.websocket import WebSocketHandler
import uuid


_USERS = {}


class EventHandler(WebSocketHandler):

    def open(self):
        print "Opened."
        self.uid = uuid.uuid4().hex
        _USERS[self.uid] = self
        self.write_message({"method": "user.id", "arguments": [self.uid]})

    def on_message(self, message):
        message = json.loads(message)
        print message
        for uid, handler in _USERS.items():
            if uid == self.uid:
                continue
            try:
                handler.write_message(message)
            except Exception as exception:
                print "Couldn't write to {}: {}".format(uid, exception)
                del _USERS[uid]

    def on_close(self):
        print "Closed."
        if self.uid in _USERS:
            del _USERS[self.uid]


class IndexHandler(RequestHandler):

    def get(self):
        self.render("index.html")


def main():
    port = int(os.environ.get("PORT", 8080))
    application = Application([
        ("/events", EventHandler),
        ("/", IndexHandler)
    ], template_path="views", static_path="static")
    application.listen(port)
    print "Listening on {}".format(port)
    IOLoop.instance().start()


if __name__ == "__main__":
    main()
