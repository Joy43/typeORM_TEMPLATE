import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import {
    QueryFailedError,
    EntityNotFoundError,
    TypeORMError,
} from "typeorm";
import { AppError } from "./handle-error.app";

export function simplifyError(
    error: unknown,
    customMessage = "Operation Failed",
    record = "Record",
): never {

    /**
     * TypeORM: Entity Not Found
     */
    if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`${record} not found`);
    }

    /**
     * TypeORM: Query Failed (DB constraint errors)
     */
    if (error instanceof QueryFailedError) {
        const driverError: any = (error as any).driverError;

        switch (driverError?.code) {
            case "23505": // unique_violation
                throw new ConflictException(`${record} already exists`);

            case "23503": // foreign_key_violation
                throw new BadRequestException(`Invalid ${record} reference`);

            case "22P02": // invalid_text_representation
                throw new BadRequestException(`Invalid ${record} format`);

            default:
                throw new InternalServerErrorException(
                    `Database error: ${driverError?.message || error.message}`,
                );
        }
    }

    /**
     * Custom AppError
     */
    if (error instanceof AppError) {
        switch (error.code) {
            case 400:
                throw new BadRequestException(error.message);
            case 401:
                throw new UnauthorizedException(error.message);
            case 404:
                throw new NotFoundException(error.message);
            case 409:
                throw new ConflictException(error.message);
            default:
                throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * Generic TypeORM Error
     */
    if (error instanceof TypeORMError) {
        throw new InternalServerErrorException(error.message);
    }

    /**
     * Fallback
     */
    throw new InternalServerErrorException(
        (error as Error)?.message || customMessage,
    );
}
