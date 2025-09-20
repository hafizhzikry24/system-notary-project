<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Finance Report - {{ $reportData['month'] }}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
    <h2>📊 Finance Report - {{ $reportData['month'] }}</h2>

    <p>Berikut adalah rekap laporan keuangan bulan ini:</p>

    <table style="width:100%; border-collapse:collapse; margin-top:15px;">
        <tr>
            <td style="padding:8px; border:1px solid #ddd;">💰 Total Uang Muka </td>
            <td style="padding:8px; border:1px solid #ddd;">
                Rp {{ number_format($reportData['totalDownPayment'], 0, ',', '.') }}
            </td>
        </tr>
        <tr>
            <td style="padding:8px; border:1px solid #ddd;">✅ Total Terbayarkan</td>
            <td style="padding:8px; border:1px solid #ddd;">
                Rp {{ number_format($reportData['totalPaid'], 0, ',', '.') }}
            </td>
        </tr>
        <tr>
            <td style="padding:8px; border:1px solid #ddd;">📈 Total Penjualan</td>
            <td style="padding:8px; border:1px solid #ddd;">
                Rp {{ number_format($reportData['totalSale'], 0, ',', '.') }}
            </td>
        </tr>
        <tr>
            <td style="padding:8px; border:1px solid #ddd;">⏳ Total Utang</td>
            <td style="padding:8px; border:1px solid #ddd;">
                Rp {{ number_format($reportData['totalRemaining'], 0, ',', '.') }}
            </td>
        </tr>
    </table>

    <p style="margin-top:20px;">Terima kasih,<br>Finance System</p>
</body>
</html>
