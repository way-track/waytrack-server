/*
 * Copyright Jorge Toro Hoyos (jolthgs@gmail.com).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import BaseTcpProtocol from "../baseTcpProtocol.js";
import c from "config";

const config = c.get("Protocols.h02");


class H02TcpProtocol extends BaseTcpProtocol {
  timeout = config.timeout; // [config] 6 minutes of inactivity

  constructor(host, port, options) {
    super(host, port, options)
  }
}

export default new H02TcpProtocol(config.host, config.port);
