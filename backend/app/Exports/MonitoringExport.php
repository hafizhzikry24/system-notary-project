<?php

namespace App\Exports;

use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MonitoringExport implements FromCollection, WithHeadings, WithStyles
{

    // initialization variable
    private $monitoring;

    /**
     * Create a new instance.
     *
     * @return void
     */
    public function __construct($monitoring)
    {
        $this->monitoring = $monitoring;
    }

    public function headings(): array
    {
        return [
            'Client',
            'Akta Pesanan',
            'No Pesanan',
            'Nama Lembar Kerja',
            'Status',
            'Tanggal Pesanan',
            'Tanggal Jatuh Tempo',
        ];
    }


    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $data = [];
        foreach ($this->monitoring as $item) {
            $data[] = [
                $item->customerPersonal->full_name
                    ?? $item->customerBank->name
                    ?? $item->customerCompany->name
                    ?? '',
                $item->templateDeed->type ?? '',
                $item->order_number ?? '',
                $item->name_worksheet ?? '',
                $item->status ?? '',
                $item->order_date_formatted ?? '',
                $item->deadline_date_formatted ?? '',
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
