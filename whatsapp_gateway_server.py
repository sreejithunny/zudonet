"""
=============================================================================
ZUDONET TECHNOLOGIES - ALTERNATIVE WHATSAPP GATEWAY LOCAL SERVER
Based on Alternative-WhatsApp-Gateway-Plugin architecture
Listening on: http://localhost:3000/send/message
Target Mobile: +91 9072103103
=============================================================================
"""

import sys
import json
import urllib.parse
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 3000
TARGET_PHONE = "919072103103"

class WhatsAppGatewayHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self, status=200):
        self.send_response(status)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Device-Id')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers(200)

    def do_GET(self):
        if self.path == '/' or self.path.startswith('/devices') or self.path.startswith('/status'):
            self._set_cors_headers(200)
            res = {
                "success": True,
                "status": "online",
                "gateway": "Alternative WhatsApp Gateway (Zudonet)",
                "targetPhone": TARGET_PHONE,
                "port": PORT
            }
            self.wfile.write(json.dumps(res).encode('utf-8'))
        elif '/plugin/wga_sendMessage' in self.path:
            # Compatibility with wga_sendMessage GET endpoint from the plugin
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            phone = params.get('phone', [TARGET_PHONE])[0]
            message = params.get('message', [''])[0]
            self.handle_message_delivery(phone, message)
        else:
            self._set_cors_headers(404)
            self.wfile.write(json.dumps({"success": False, "message": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        if self.path in ['/send/message', '/api/sendmessage', '/plugin/wga_sendMessage']:
            content_length = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_length).decode('utf-8')
            
            try:
                data = json.loads(post_body)
            except Exception:
                data = urllib.parse.parse_qs(post_body)
                data = {k: v[0] for k, v in data.items()}

            phone = data.get('phone', TARGET_PHONE)
            message = data.get('message', '')

            self.handle_message_delivery(phone, message)
        else:
            self._set_cors_headers(404)
            self.wfile.write(json.dumps({"success": False, "message": "Route not found"}).encode('utf-8'))

    def handle_message_delivery(self, phone, message):
        clean_phone = phone.replace('@s.whatsapp.net', '').replace('+', '').strip()
        print("\n" + "="*60)
        print("📥 INCOMING WHATSAPP MESSAGE VIA GATEWAY:")
        print(f"📱 Target Phone: +{clean_phone or TARGET_PHONE}")
        print(f"💬 Message:\n{message}")
        print("="*60 + "\n")

        # Open WhatsApp Web / App directly to send to +919072103103
        try:
            encoded_msg = urllib.parse.quote(message)
            wa_url = f"https://api.whatsapp.com/send?phone={clean_phone or TARGET_PHONE}&text={encoded_msg}"
            # Launch WhatsApp in browser if desired
            webbrowser.open(wa_url)
            print(f"🚀 Dispatched to WhatsApp URL: {wa_url}")
        except Exception as e:
            print(f"⚠️ Could not open browser: {e}")

        self._set_cors_headers(200)
        res = {
            "success": True,
            "message": "Message sent to WhatsApp gateway successfully",
            "target": clean_phone or TARGET_PHONE
        }
        self.wfile.write(json.dumps(res).encode('utf-8'))

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, WhatsAppGatewayHandler)
    print("*" * 65)
    print(f"⚡ ZUDONET WHATSAPP GATEWAY SERVER ACTIVE ON PORT {PORT}")
    print(f"📲 Integrated Target Number: +{TARGET_PHONE}")
    print(f"🔗 Gateway API: http://localhost:{PORT}/send/message")
    print(f"💡 Compatible with Alternative-WhatsApp-Gateway-Plugin")
    print("Press Ctrl+C to stop the gateway.")
    print("*" * 65)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nGateway server stopped.")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
