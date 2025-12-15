<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    public function sendTeamsMessage(string $title, string $text): void
    {
        $webhook = config('app.ms_teams_webhook');
        if (! $webhook) {
            Log::warning('MS Teams webhook URL is not configured');
            return;
        }

        $payload = [
            '@type' => 'MessageCard',
            '@context' => 'http://schema.org/extensions',
            'summary' => $title,
            'themeColor' => '0076D7',
            'title' => $title,
            'text' => $text,
        ];

        try {
            Http::post($webhook, $payload);
        } catch (\Throwable $e) {
            Log::error('Failed to send Teams notification', ['error' => $e->getMessage()]);
        }
    }

    public function sendEmail(string $to, string $subject, string $text): void
    {
        try {
            Mail::raw($text, function ($mail) use ($to, $subject) {
                $mail->to($to)->subject($subject);
            });
        } catch (\Throwable $e) {
            Log::error('Failed to send email notification', ['error' => $e->getMessage()]);
        }
    }
}
