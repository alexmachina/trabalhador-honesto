import { createConnection, Connection } from "typeorm";
import { Punch, PunchType } from "./entity/Punch";
import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import moment from "moment";
enum OperationType {
  LIST,
  ADD
}

const createDatabaseConnection = () => {
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "postgres",
    password: "mysecretpassword",
    database: "postgres",
    entities: [__dirname + "/entity/*.js"],
    dropSchema: false,
    synchronize: true
  });
};

const askPunch = async (connection: Connection) => {
  const answers = await inquirer.prompt({
    name: "punchType",
    type: "list",
    message: "Ta vazando?",
    choices: [
      { value: PunchType.OUT, name: "Ja fiz a minha parti 😇" },
      { value: PunchType.IN, name: "Nada, to cheganu vei 😅" }
    ]
  });

  const punchType: PunchType = answers.punchType;
  const punchRegister = await connection
    .getRepository(Punch)
    .save({ type: punchType });

  const formatedDate = moment(punchRegister.createdAt).format("HH:MM");

  console.log(`\nPonto registrado: ${punchRegister.type} ${formatedDate}`);
};

const listPunches = async (connection: Connection) => {
  const punches = await connection.getRepository(Punch).find();
  const beautiful = punches.map(p => {
    const formatedDate = moment(p.createdAt).format("HH:MM");

    return `${p.type} ${formatedDate}`;
  });
  console.log(beautiful.join("\n"));
};

const execProgram = async () => {
  const connection = await createDatabaseConnection();
  console.log(
    chalk.yellow(
      figlet.textSync("BEM VINDO, OPERARIO", { horizontalLayout: "fitted" })
    )
  );
  console.log(
    chalk.blue("O barato ainda só registra ponto... Isso QUANDO registra")
  );

  const answers = await inquirer.prompt({
    name: "operationType",
    type: "list",
    message: "E ai, que que ce quer?",
    choices: [
      { value: OperationType.ADD, name: "bater ponto do trabalhador honesto" },
      {
        value: OperationType.LIST,
        name: "Listar histórico de ponto do trabalhador honesto"
      }
    ]
  });

  const { operationType } = answers;
  if (operationType === OperationType.ADD) {
    await askPunch(connection);
  }

  if (operationType === OperationType.LIST) {
    await listPunches(connection);
  }

  await connection.close();
};

execProgram();
