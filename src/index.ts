import buildServer from './app';

const main = () =>{
  const server = buildServer();

  let port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  server.listen({ port, host: '::' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};

main();