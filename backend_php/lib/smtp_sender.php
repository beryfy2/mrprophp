<?php

class SMTPSender {
    private $host;
    private $port;
    private $username;
    private $password;
    private $from;
    private $debug = false;

    public function __construct($host, $port, $username, $password, $from) {
        $this->host = $host;
        $this->port = $port;
        $this->username = $username;
        $this->password = $password;
        $this->from = $from;
    }

    public function send($to, $subject, $body) {
        $socket = fsockopen('ssl://' . $this->host, $this->port, $errno, $errstr, 30);
        if (!$socket) {
            return "Could not connect to SMTP host: $errstr ($errno)";
        }

        $this->read($socket); // Greeting

        if (!$this->command($socket, "EHLO " . $this->host)) return "EHLO failed";
        if (!$this->command($socket, "AUTH LOGIN")) return "AUTH LOGIN failed";
        if (!$this->command($socket, base64_encode($this->username))) return "Username failed";
        if (!$this->command($socket, base64_encode($this->password))) return "Password failed";

        if (!$this->command($socket, "MAIL FROM: <" . $this->from . ">")) return "MAIL FROM failed";
        if (!$this->command($socket, "RCPT TO: <" . $to . ">")) return "RCPT TO failed";
        if (!$this->command($socket, "DATA")) return "DATA failed";

        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=utf-8\r\n";
        $headers .= "From: " . $this->from . "\r\n";
        $headers .= "To: " . $to . "\r\n";
        $headers .= "Subject: " . $subject . "\r\n";

        fputs($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
        $result = $this->read($socket);
        if (substr($result, 0, 3) != '250') {
            return "Message body failed: $result";
        }

        if (!$this->command($socket, "QUIT")) return "QUIT failed";

        fclose($socket);
        return true;
    }

    private function command($socket, $cmd) {
        fputs($socket, $cmd . "\r\n");
        $response = $this->read($socket);
        if ($this->debug) {
            echo "CMD: $cmd\nRESP: $response\n";
        }
        // Success codes are usually 2xx or 3xx
        $code = substr($response, 0, 3);
        return ($code >= 200 && $code < 400);
    }

    private function read($socket) {
        $response = '';
        while ($str = fgets($socket, 515)) {
            $response .= $str;
            if (substr($str, 3, 1) == ' ') {
                break;
            }
        }
        return $response;
    }
}
?>