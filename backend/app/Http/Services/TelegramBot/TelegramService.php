<?php

namespace App\Http\Services\TelegramBot;

use Illuminate\Support\Facades\Http;

class TelegramService
{
    /**
     * The Telegram bot token.
     *
     * @var string
     */
    protected string $token;
    protected string $chatId;

    /**
     * TelegramService constructor.
     */
    public function __construct()
    {
        $this->token = config('services.telegram.token');
        $this->chatId = config('services.telegram.chat_id');
    }

    /**
     * Send a message to the Telegram bot.
     *
     * @param string $message
     * @return bool
     */
    public function sendMessage(string $message): bool
    {
        // Send the message to the Telegram bot
        $url = "https://api.telegram.org/bot{$this->token}/sendMessage";

        $response = Http::post($url, [
            'chat_id' => $this->chatId,
            'text'    => $message,
            'parse_mode' => 'Markdown',
        ]);

        return $response->successful();
    }
}
