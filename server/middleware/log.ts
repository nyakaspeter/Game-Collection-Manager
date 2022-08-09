export default defineEventHandler((event) => {
  console.log(`➔  ${event.req.method}: ${event.req.url}`);
});
