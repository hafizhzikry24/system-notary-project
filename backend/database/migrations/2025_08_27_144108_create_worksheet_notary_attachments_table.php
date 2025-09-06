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
        Schema::create('worksheet_notary_attachments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('worksheet_notary_id')->index('wna_wn_id');
            $table->string('file_name');
            $table->string('file_path');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes()->index('wna_da');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worksheet_notary_attachments');
    }
};
