import { IsString } from 'class-validator'

export class ActorDto {
	@IsString()
	name: string

	@IsString()
	slug: string

	@IsString()
	photo: string
}

/*
If you need a more complex story with saving files
{
	name: string,
	url: string,
	size: string,
	_id: string,
}
*/
