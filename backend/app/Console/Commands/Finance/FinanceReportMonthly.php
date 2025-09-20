<?php

namespace App\Console\Commands\Finance;

use Illuminate\Console\Command;
use App\Jobs\Finance\FinanceReportJob;

class FinanceReportMonthly extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:finance-report-monthly';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send Mail Finance Report Monthly';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            FinanceReportJob::dispatch();
        } catch (\Exception $e) {
            $this->error('An error occurred: ' . $e->getMessage());
        }
    }
}
