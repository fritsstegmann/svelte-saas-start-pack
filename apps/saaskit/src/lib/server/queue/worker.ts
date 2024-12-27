import { worker } from "quey";
import { driver } from "./redisDriver";

worker(driver, __dirname);
