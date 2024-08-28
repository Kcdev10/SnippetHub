import app from './aap';
import { ENV } from './constants/constant';

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT} 🎉🎉`);
});
