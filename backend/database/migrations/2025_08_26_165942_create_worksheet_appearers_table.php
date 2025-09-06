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
        Schema::create('worksheet_appearers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('worksheet_notary_id')->index('wa_wni');
            $table->unsignedBigInteger('appearer_id')->index('wa_ai');
            $table->timestamps();
            $table->softDeletes()->index('wa_da');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worksheet_appearers');
    }
};
