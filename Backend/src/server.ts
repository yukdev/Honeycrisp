import app from './index';
import { config } from './config';

app.listen(config.PORT, () => {
  console.log(`Started on http://localhost:${config.PORT}`);
});
