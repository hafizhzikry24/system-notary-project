<?php

namespace App\Exports;

use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class FundCashBankExport implements FromCollection, WithHeadings, WithStyles
{

    // initialization variable
    private $fund;

    /**
     * Create a new instance.
     *
     * @return void
     */
    public function __construct($fund)
    {
        $this->fund = $fund;
    }

    public function headings(): array
    {
        return [
            'Kas/Bank',
            'Tipe',
            'Atas Nama',
            'Nomor Akun/Rekening',
            'Jumlah',
        ];
    }


    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $data = [];
        foreach ($this->fund as $item) {
            $data[] = [
                $item->fund_name ?? '',
                $item->type ?? '',
                $item->on_behalf_of ?? '',
                $item->account_number ?? '',
                $item->amount_formatted ?? '',
            ];
        }

        return collect($data);
    }

    /**
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Header row (row 1)
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'], // white text
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '1E90FF'], // blue background
                ],
            ],
        ];
    }
}
