<?php
class JWT {
    public static function encode($payload, $key, $alg = 'HS256') {
        $header = ['typ' => 'JWT', 'alg' => $alg];
        $header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($header)));
        $payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
        $signature = hash_hmac('sha256', "$header.$payload", $key, true);
        $signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        return "$header.$payload.$signature";
    }

    public static function decode($token, $key) {
        $parts = explode('.', $token);
        if (count($parts) != 3) return null;
        $header = $parts[0];
        $payload = $parts[1];
        $signature = $parts[2];
        
        $validSignature = hash_hmac('sha256', "$header.$payload", $key, true);
        $validSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($validSignature));
        
        if ($signature === $validSignature) {
            return json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
        }
        return null;
    }
}
?>
