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
        Schema::create('fund_cash_banks', function (Blueprint $table) {
            $table->id();
            $table->string('fund_name');
            $table->string('type');
            $table->string('on_behalf_of')->nullable();
            $table->string('account_number')->nullable();
            $table->decimal('amount', 28, 2)->nullable();
            $table->timestamps();
            $table->softDeletes()->index('fcb_da');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fund_cash_banks');
    }
};
