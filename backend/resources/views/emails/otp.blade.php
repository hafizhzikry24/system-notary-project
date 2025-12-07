<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi OTP</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">Verifikasi Email</h1>
            <p style="color: #7f8c8d;">Gunakan kode OTP di bawah ini untuk memverifikasi alamat email Anda</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-bottom: 20px;">Kode OTP Anda</h2>
            <div style="font-size: 32px; font-weight: bold; color: #3498db; letter-spacing: 8px; margin: 20px 0; padding: 20px; background-color: #ecf0f1; border-radius: 8px;">
                {{ $otp }}
            </div>
            <p style="color: #7f8c8d; margin-top: 20px;">Kode ini akan kedaluwarsa dalam 5 menit</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 8px; text-align: center;">
            <h3 style="color: #2c3e50; margin-bottom: 10px;">Pemberitahuan Keamanan</h3>
            <p style="color: #34495e; font-size: 14px;">
                Jangan pernah membagikan kode OTP ini kepada siapa pun. Jika Anda tidak meminta kode ini, abaikan email ini.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #95a5a6; font-size: 12px;">
            <p>Ini adalah pesan otomatis. Mohon jangan balas email ini.</p>
        </div>
    </div>
</body>
</html>
