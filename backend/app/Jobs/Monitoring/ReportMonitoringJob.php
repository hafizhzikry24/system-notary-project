<?php

namespace App\Jobs\Monitoring;

use App\Http\Services\TelegramBot\TelegramService;
use App\Models\WorksheetNotary;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Http\Repositories\Interface\MonitoringRepositoryInterface;

class ReportMonitoringJob implements ShouldQueue
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
    public function handle(
        MonitoringRepositoryInterface $monitoringRepository,
        TelegramService $telegram
    ): void { {
            $query = WorksheetNotary::query()
                ->with(['customerPersonal', 'customerBank', 'customerCompany', 'templateDeed']);

            // Get the counts for each status
            $monitorings = $query->select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray();

            $countReport = $monitoringRepository->getHeaderData($monitorings);

            // Format the message
            $message = "*Report Monitoring*\n\n";
            $message .= "📄 Draft: " . ($countReport['draft'] ?? 0) . "\n";
            $message .= "⏳ Pending: " . ($countReport['pending'] ?? 0) . "\n";
            $message .= "🔄 Dalam Proses: " . ($countReport['processing'] ?? 0) . "\n";
            $message .= "✅ Selesai: " . ($countReport['completed'] ?? 0) . "\n";
            $message .= "❌ Cancel: " . ($countReport['canceled'] ?? 0);

            // Send to Telegram
            $telegram->sendMessage($message);
        }
    }
}
