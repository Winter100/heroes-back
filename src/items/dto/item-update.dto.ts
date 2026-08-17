import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './item-create.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// 장비의 경우 슬롯, 연마, 세트 옵션
export class UpdateItemDto extends PartialType(CreateItemDto) {
  // 연마는 연마스텟, 최대수치, 1회수치, 재료, 재료갯수
  // 세트는 따로 세트효과를 넣고 거기서 아이템 선택하게 하기?
}
