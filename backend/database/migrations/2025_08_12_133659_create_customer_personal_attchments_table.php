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
        Schema::create('customer_personal_attchments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_personal_id')->index('cpi_cpa');
            $table->string('file_name')->nullable();
            $table->string('file_path')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes()->index('cpa_da');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_personal_attchments');
    }
};
