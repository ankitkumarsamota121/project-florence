import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello() {
    return 'bye';
  }

  @Mutation(() => Boolean)
  async singleUpload(
    @Arg('file', () => GraphQLUpload)
    { createReadStream, filename }: FileUpload
  ) {
    const a = filename.split('.');
    const idx = a.length - 1;
    const ext = a[idx];

    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(
          createWriteStream(__dirname + `/../../files/${uuidv4() + '.' + ext}`)
        )
        .on('finish', () => resolve(true))
        .on('error', () => reject(false))
    );
  }
}
