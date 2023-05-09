import { config } from './config';
import app from './index';

app.listen(config.PORT, () => {
  console.log(`Started on http://localhost:${config.PORT}`);
});
