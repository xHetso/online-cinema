import { ConfigService } from '@nestjs/config'

export const getTelegramConfig = () => ({
	chatId: new ConfigService().get<string>('TELEGRAM_CHAT_ID'),
	token: new ConfigService().get<string>('TELEGRAM_TOKEN'),
})
