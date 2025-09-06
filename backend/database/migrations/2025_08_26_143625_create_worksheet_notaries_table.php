<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('worksheet_notaries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_personal_id')->index('wn_cpi')->nullable();
            $table->unsignedBigInteger('customer_bank_id')->index('wn_cbi')->nullable();
            $table->unsignedBigInteger('customer_company_id')->index('wn_cci')->nullable();
            $table->unsignedBigInteger('template_deed_id')->index('wn_tdi');
            $table->string('order_number');
            $table->date('order_date');
            $table->string('type_customer');
            $table->string('name_worksheet');
            $table->date('deadline_date');
            $table->text('description')->nullable();
            $table->decimal('fee', 28, 2);
            $table->decimal('down_payment', 28, 2)->nullable();
            $table->string('status')->default('draft');
            $table->timestamps();
            $table->softDeletes()->index('wn_da');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worksheet_notaries');
    }
};
