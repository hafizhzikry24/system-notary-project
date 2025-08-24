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
        Schema::create('template_deeds', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes()->index('td_da');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_deeds');
    }
};
