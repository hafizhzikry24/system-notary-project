<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Permintaan Atur Ulang Kata Sandi</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #1a222c;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
            border-top: none;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            background-color: #f1f1f1;
            padding: 20px;
            text-align: center;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
            font-size: 12px;
            color: #666;
        }
        .company-info {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Permintaan Atur Ulang Kata Sandi</h1>
        <p>Sistem Informasi Notaris</p>
    </div>

    <div class="content">
        <p>Halo,</p>

        <p>Anda telah meminta untuk mengatur ulang kata sandi akun Sistem Informasi Notaris.</p>

        <p>Klik tombol di bawah ini untuk mengatur ulang kata sandi Anda:</p>

        <p style="text-align: center;">
            <a href="{{ $resetUrl }}" class="button">Atur Ulang Kata Sandi</a>
        </p>

        <p><strong>Penting:</strong></p>
        <ul>
            <li>Tautan ini akan kedaluwarsa dalam 15 menit untuk keamanan</li>
            <li>Jika Anda tidak meminta pengaturan ulang kata sandi, harap abaikan email ini</li>
            <li>Jangan pernah membagikan tautan ini kepada siapapun</li>
        </ul>

        <p>Jika tombol di atas tidak berfungsi, Anda dapat menyalin dan menempelkan tautan berikut ke browser Anda:</p>
        <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 3px;">
            {{ $resetUrl }}
        </p>
    </div>

    <div class="footer">
        <p>Ini adalah pesan otomatis dari Sistem Informasi Notaris.</p>
        <p>Jika Anda memiliki pertanyaan, silakan hubungi administrator sistem.</p>
        <p>&copy; {{ date('Y') }} Sistem Informasi Notaris. Hak Cipta Dilindungi.</p>
    </div>
</body>
</html>
