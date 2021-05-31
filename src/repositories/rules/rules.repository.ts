import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Rule } from '@models/rules';
import * as fs from 'fs';
import * as path from 'path';
const fileName = path.basename('../../database/db.json');
const filePath = path.join(__dirname, '..', '..', 'database', fileName);

@Injectable()
export class RulesRepository {
  public getAllRules(): Array<any> {
    try {
      const result = fs.readFileSync(filePath, 'utf-8');
      if (!result) {
        return [];
      }
      return JSON.parse(result);
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  public createRule(rule: Rule): void {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err)
        throw new HttpException(`${err.message}`, HttpStatus.BAD_REQUEST);
      if (!data) {
        const rulesArray = [rule];
        fs.writeFile(filePath, JSON.stringify(rulesArray), (err) => {
          if (err) {
            throw new HttpException(`${err.message}`, HttpStatus.BAD_REQUEST);
          }
          console.log('JSON data is saved.');
        });

        return;
      }

      const arrayResult = JSON.parse(data);
      arrayResult.push(rule);
      fs.writeFile(filePath, JSON.stringify(arrayResult), (err) => {
        if (err) {
          throw new HttpException(`${err.message}`, HttpStatus.BAD_REQUEST);
        }
        console.log('JSON data is saved.');
      });
    });

    throw new HttpException('Rule Created Sucessfully!', HttpStatus.CREATED);
  }
}
