import socket

class Network:
    def __init__(self):
        print("Initializing Request")
        self.client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server = "192.168.1.8" ## <-- Your IP here
        self.port = 5555 ## Default port, can change if you want.
        self.addr = (self.server, self.port)
        self.id = self.connect()
        print(self.id)

    def connect(self):
        try:
            self.client.connect(self.addr)
            return self.client.recv(2048).decode()
        except:
            pass

    def send(self, data):
        try:
            self.client.send(str.encode(data))
            return self.client.recv(2048).decode()
        except socket.error as e:
            print(e)

n = Network()
print(n.send("Working"))