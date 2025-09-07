<?php

namespace App\Console\Commands\Monitoring;

use Illuminate\Console\Command;
use App\Jobs\Monitoring\ReportMonitoringJob;

class ReportMonitoringWorksheet extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:report-monitoring-worksheet';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            ReportMonitoringJob::dispatch();
        } catch (\Exception $e) {
            $this->error('An error occurred: ' . $e->getMessage());
        }
    }
}
