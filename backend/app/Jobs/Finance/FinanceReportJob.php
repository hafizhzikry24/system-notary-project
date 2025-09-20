<?php

namespace App\Jobs\Finance;

use Carbon\Carbon;
use App\Mail\FinanceReport;
use App\Models\WorksheetNotary;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Enums\Worksheet\StatusOrderEnum;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Http\Repositories\Interface\FinanceReportRepositoryInterface;

class FinanceReportJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
   public function handle(): void
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth   = $now->copy()->endOfMonth();

        // Base query with filter this month
        $query = WorksheetNotary::whereBetween('order_date', [$startOfMonth, $endOfMonth]);

        $totalDownPayment = (clone $query)->sum('down_payment');
        $totalPaid        = (clone $query)->where('status', StatusOrderEnum::COMPLETED->value)->sum('fee');
        $totalSale        = (clone $query)->sum('fee');
        $totalRemaining   = $totalDownPayment - $totalPaid;

        // Prepare data for the report
        $reportData = [
            'totalDownPayment' => $totalDownPayment,
            'totalPaid'        => $totalPaid,
            'totalSale'        => $totalSale,
            'totalRemaining'   => $totalRemaining,
            'month'            => $now->translatedFormat('F Y'),
        ];

        // Send the report via email
        Mail::to('finance@yourcompany.com')->send(new FinanceReport($reportData));
    }
}
