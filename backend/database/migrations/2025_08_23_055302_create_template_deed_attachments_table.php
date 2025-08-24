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
        Schema::create('template_deed_attachments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('template_deed_id');
            $table->string('file_path');
            $table->string('file_name');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes()->index('tda_da');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_deed_attachments');
    }
};
