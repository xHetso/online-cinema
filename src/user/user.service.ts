import { Injectable, NotFoundException } from '@nestjs/common'
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types'
import { genSalt, hash } from 'bcryptjs'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserModel } from './user.model'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
	) {}

	async byId(id: string): Promise<DocumentType<UserModel>> {
		const user = await this.userModel.findById(id).exec()

		if (user) return user
		throw new NotFoundException('User not found')
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.byId(_id)
		const isSameUser = await this.userModel.findOne({ email: dto.email })

		if (isSameUser && isSameUser.id !== _id) {
			throw new NotFoundException('Email busy')
		}

		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}

		user.email = dto.email
		if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin

		await user.save()

		return
	}

	async getCount() {
		return this.userModel.find().count().exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}
		if (searchTerm)
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i'),
					},
				],
			}
		return this.userModel
			.find(options)
			.select('-password -updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.exec()
	}

	async delete(id: string) {
		return this.userModel.findByIdAndDelete(id).exec()
	}
}
