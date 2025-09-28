<?php

namespace App\Http\Repositories;

use Illuminate\Support\Facades\DB;
use App\Enums\Worksheet\StatusOrderEnum;
use App\Http\Repositories\Interface\DashboardRepositoryInterface;

class DashboardRepository implements DashboardRepositoryInterface
{

    /**
     * Get grouping project information
     *
     * @param array $filters
     */
    public function projectInformation()
    {
        $customer = DB::table('customer_personals')->select(DB::raw('COUNT(*) as total'))
            ->unionAll(DB::table('customer_companies')->select(DB::raw('COUNT(*) as total')))
            ->unionAll(DB::table('customer_banks')->select(DB::raw('COUNT(*) as total')))
            ->get()->sum('total');
        $worksheet = DB::table('worksheet_notaries')->select(DB::raw('COUNT(*) as total'))
            ->get()->sum('total');
        $partner = DB::table('partners')->select(DB::raw('COUNT(*) as total'))
            ->get()->sum('total');
        $templateDeed = DB::table('template_deeds')->select(DB::raw('COUNT(*) as total'))
            ->get()->sum('total');

        return [
            'worksheet'    => $worksheet,
            'customer'   => $customer,
            'partner' => $partner,
            'template_deed'  => $templateDeed
        ];
    }

    /**
     * Get grouping graphic work information
     *
     * @param array $filters
     */
    public function graphicWorkInformation()
    {
        $data = DB::table('worksheet_notaries as w')
            ->join('template_deeds as t', 'w.template_deed_id', '=', 't.id')
            ->select('t.type as template_deed', DB::raw('COUNT(w.id) as count'))
            ->groupBy('t.type')
            ->get();

        return $data;
    }

    /**
     * Get grouping progress information
     *
     * @param array $filters
     */
    public function progressInformation($monitoring)
    {
        $draft = $monitoring[StatusOrderEnum::DRAFT->value] ?? 0;
        $pending = $monitoring[StatusOrderEnum::PENDING->value] ?? 0;
        $processing = $monitoring[StatusOrderEnum::IN_PROGRESS->value] ?? 0;
        $completed = $monitoring[StatusOrderEnum::COMPLETED->value] ?? 0;
        $canceled = $monitoring[StatusOrderEnum::CANCELLED->value] ?? 0;

        return [
            'draft'      => $draft,
            'pending'    => $pending,
            'processing' => $processing,
            'completed'  => $completed,
            'canceled'   => $canceled,
        ];
    }

    /**
     * Get grouping client progress information
     *
     * @param array $filters
     */
    public function clientProgressInformation()
    {
        $customerPersonal = DB::table('customer_personals')->select(DB::raw('COUNT(*) as total'))->get()
            ->sum('total');
        $customerCompany = DB::table('customer_companies')->select(DB::raw('COUNT(*) as total'))->get()
            ->sum('total');
        $customerBank = DB::table('customer_banks')->select(DB::raw('COUNT(*) as total'))->get()
            ->sum('total');

        return [
            'customer_personal' => $customerPersonal,
            'customer_company' => $customerCompany,
            'customer_bank' => $customerBank,
        ];
    }
}
