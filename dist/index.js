#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/tsup@8.1.0_typescript@5.5.3/node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// src/index.ts
var import_prompts = require("@clack/prompts");
var import_picocolors = __toESM(require("picocolors"));
var import_yargs = __toESM(require("yargs"));
var import_helpers = require("yargs/helpers");

// src/commands/create.ts
var import_promises3 = require("fs/promises");
var import_path2 = __toESM(require("path"));

// src/helpers/installation.ts
var import_promises2 = require("fs/promises");
var import_path = __toESM(require("path"));

// src/helpers/utils.ts
var import_glob = require("glob");
var import_node_child_process = require("child_process");
var import_promises = require("fs/promises");
var import_node_path = __toESM(require("path"));
var import_node_url = require("url");
var import_node_util = require("util");
var execAsync = (0, import_node_util.promisify)(import_node_child_process.exec);
var execAsyncWithDebug = async (command, options) => {
  const isDebug = true;
  if (isDebug) {
    await runCommand(command, options);
    return { stdout: "", stderr: "" };
  } else {
    return await execAsync(command, options);
  }
};
var runCommand = (command, options) => {
  return new Promise((resolve, reject) => {
    const isDebug = process.env.DEBUG === "true" || process.env.DEBUG === "1";
    if (isDebug) {
      console.log(`\u{1F527} [DEBUG] Ejecutando comando: ${command}`);
      if (options?.cwd) {
        console.log(`\u{1F527} [DEBUG] Directorio de trabajo: ${options.cwd}`);
      }
    }
    const child = (0, import_node_child_process.spawn)(command, {
      cwd: options?.cwd,
      shell: true,
      stdio: "inherit"
    });
    child.on("close", (code) => {
      if (isDebug) {
        console.log(`\u{1F527} [DEBUG] Comando finalizado con c\xF3digo: ${code}`);
      }
      if (code === 0) resolve();
      else reject(new Error(`Command failed with exit code ${code}`));
    });
  });
};
var getSourcePath = (...folderOrFiles) => import_node_path.default.join(import_node_path.default.dirname((0, import_node_url.fileURLToPath)(importMetaUrl)), ...folderOrFiles);
async function replaceFiles(projectName, projectType, template) {
  const origen = getSourcePath();
  const TEMPLATES = `${origen}/templates`;
  const templatePath = `${TEMPLATES}/${projectType}/${template}`;
  const destinationPath = import_node_path.default.join(process.cwd(), projectName);
  try {
    await (0, import_promises.cp)(`${templatePath}`, destinationPath, { recursive: true });
    if (!template.includes("next")) {
      await (0, import_promises.cp)(`${origen}/always/.vscode`, `${destinationPath}/.vscode`, { recursive: true });
    }
    const files = await (0, import_glob.glob)(`**/*`, {
      nodir: true,
      cwd: destinationPath,
      absolute: true,
      ignore: ["**/node_modules/**"]
    });
    for await (const file of files) {
      const binaryExtensions = [
        ".ico",
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".svg",
        ".webp",
        ".bmp",
        ".tiff",
        ".woff",
        ".woff2",
        ".ttf",
        ".eot",
        ".otf",
        ".mp3",
        ".mp4",
        ".avi",
        ".mov",
        ".wav",
        ".pdf",
        ".zip",
        ".tar",
        ".gz"
      ];
      const fileExtension = import_node_path.default.extname(file).toLowerCase();
      if (binaryExtensions.includes(fileExtension)) {
        continue;
      }
      const data = await (0, import_promises.readFile)(file, "utf8");
      const draft = data.replace(/{{\s*projectName\s*}}/g, projectName);
      await (0, import_promises.writeFile)(file, draft, "utf8");
    }
  } catch (err) {
    console.error(err);
  }
}
async function removeFiles(projectName, template) {
  const projectDirectory = import_node_path.default.join(process.cwd(), projectName);
  if (template.includes("next")) {
    try {
      await (0, import_promises.rm)(`${projectDirectory}/public/file.svg`);
      await (0, import_promises.rm)(`${projectDirectory}/public/globe.svg`);
      await (0, import_promises.rm)(`${projectDirectory}/public/next.svg`);
      await (0, import_promises.rm)(`${projectDirectory}/public/vercel.svg`);
      await (0, import_promises.rm)(`${projectDirectory}/public/window.svg`);
    } catch (err) {
      console.error(err);
    }
  }
  if (template.includes("vite")) {
    try {
      await (0, import_promises.rm)(import_node_path.default.join(projectDirectory, ".eslintrc.cjs"), { force: true });
      await (0, import_promises.rm)(import_node_path.default.join(projectDirectory, "src", "App.css"), { force: true });
      await (0, import_promises.rm)(import_node_path.default.join(projectDirectory, "src", "index.css"), { force: true });
      await (0, import_promises.rm)(import_node_path.default.join(projectDirectory, "src", "assets"), { recursive: true, force: true });
      await (0, import_promises.rm)(import_node_path.default.join(projectDirectory, "src", "vite.config.js"), { force: true });
    } catch (err) {
      console.error(err);
    }
  }
}
function getPkgManager(args) {
  if (args["use-pnpm"]) return "pnpm";
  if (args["use-yarn"]) return "yarn";
  if (args["use-npm"]) return "npm";
  if (args["use-bun"]) return "bun";
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent?.startsWith("yarn")) {
    return "yarn";
  } else if (userAgent?.startsWith("pnpm")) {
    return "pnpm";
  } else if (userAgent?.startsWith("bun")) {
    return "bun";
  }
  return "npm";
}
var checkIfYarnIsInstalled = async () => {
  try {
    await execAsyncWithDebug("yarn --version");
    return true;
  } catch (error) {
    return false;
  }
};
async function addUltraciteScripts(projectName, pkgManager) {
  const projectDirectory = import_node_path.default.join(process.cwd(), projectName);
  const packageJsonPath = import_node_path.default.join(projectDirectory, "package.json");
  const cmd = pkgManager.startsWith("n") ? "npx" : pkgManager === "bun" ? "bunx" : `${pkgManager} dlx`;
  try {
    const packageJsonContent = await (0, import_promises.readFile)(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    if (!packageJson.scripts.check) {
      packageJson.scripts.check = `${cmd} ultracite check`;
    }
    if (!packageJson.scripts.fix) {
      packageJson.scripts.fix = `${cmd} ultracite fix`;
    }
    await (0, import_promises.writeFile)(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");
  } catch (error) {
    console.error("Error adding ultracite scripts:", error);
  }
}
async function fixUltraciteErrors(projectName, pkgManager) {
  const projectDirectory = import_node_path.default.join(process.cwd(), projectName);
  const cmd = pkgManager.startsWith("n") ? "npm" : pkgManager;
  await execAsyncWithDebug(`${cmd} ultracite fix`, {
    cwd: projectDirectory
  });
}

// src/helpers/installation.ts
var installEslintDevDeps = async (pkgManager, projectName, template) => {
  const cmd = pkgManager.startsWith("n") ? "npm i -D" : `${pkgManager} add -D`;
  const deps = [
    "@typescript-eslint/eslint-plugin",
    "prettier",
    "eslint-plugin-import",
    "eslint-plugin-prettier",
    "eslint-config-prettier"
  ];
  if (template.includes("vite")) {
    deps.push("eslint-plugin-react");
  }
  await execAsyncWithDebug(`${cmd} ${deps.join(" ")}`, {
    cwd: import_path.default.join(process.cwd(), projectName)
  });
};
var installTailwindAndInit = async (pkgManager, projectName) => {
  const projectDirectory = import_path.default.join(process.cwd(), projectName);
  const installCmd = pkgManager.startsWith("n") ? "npm i -D" : `${pkgManager} add -D`;
  const initCmd = pkgManager.startsWith("n") ? "npx" : `${pkgManager}`;
  await execAsyncWithDebug(`${installCmd} tailwindcss postcss autoprefixer`, {
    cwd: projectDirectory
  });
  await execAsyncWithDebug(`${initCmd} tailwindcss init -p`, {
    cwd: projectDirectory
  });
};
async function installRainbowKit(projectName, pkgManager) {
  const projectDirectory = import_path.default.join(process.cwd(), projectName);
  const cmd = pkgManager === "npm" ? "npm i" : `${pkgManager} add`;
  await execAsyncWithDebug(`${cmd} @rainbow-me/rainbowkit wagmi ethers@^5`, {
    cwd: projectDirectory
  });
}
async function installShadcn(projectName, template, pkgManager) {
  const projectDirectory = import_path.default.join(process.cwd(), projectName);
  const cmd = pkgManager === "pnpm" ? "pnpm dlx" : pkgManager === "bun" ? "bunx" : "npx";
  const installCmd = pkgManager.startsWith("n") ? "npm i" : `${pkgManager} add`;
  if (template.includes("next")) {
    await execAsyncWithDebug(
      `${cmd} shadcn@latest init --yes --defaults --base-color neutral --src-dir`,
      {
        cwd: projectDirectory
      }
    );
  } else {
    await execAsyncWithDebug(
      `${installCmd} class-variance-authority tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react`,
      {
        cwd: projectDirectory
      }
    );
    const filesForVite = getSourcePath("always", "shadcn", template);
    await (0, import_promises2.cp)(`${filesForVite}/tailwind.config.ts`, `${projectDirectory}/tailwind.config.js`, {
      force: true
    });
    await (0, import_promises2.cp)(`${filesForVite}/globals.css`, `${projectDirectory}/src/globals.css`);
    await (0, import_promises2.cp)(`${filesForVite}/lib`, `${projectDirectory}/src/lib`, { recursive: true });
  }
  await execAsyncWithDebug(`${cmd} --no-install shadcn add --all`, {
    cwd: projectDirectory
  });
  await execAsyncWithDebug(`${cmd} --no-install shadcn migrate radix --yes`, {
    cwd: projectDirectory
  });
}
async function installUltracite(pkgManager, projectName) {
  const projectDirectory = import_path.default.join(process.cwd(), projectName);
  const cmd = pkgManager.startsWith("n") ? "npx" : pkgManager === "bun" ? "bunx" : `${pkgManager} dlx`;
  await execAsyncWithDebug(
    `${cmd} ultracite init --frameworks next --editors vscode --agents cursor --integrations husky lefthook`,
    {
      cwd: projectDirectory
    }
  );
}

// src/commands/create.ts
async function createViteReactApp(projectName, pkgManager) {
  const createCmd = pkgManager.startsWith("n") ? "npx create-vite@latest" : `${pkgManager} create vite`;
  const cmd = pkgManager.startsWith("n") ? "npm" : `${pkgManager}`;
  await execAsyncWithDebug(`${createCmd} ${projectName} --template react-swc-ts`, {
    cwd: process.cwd()
  });
  await execAsyncWithDebug(`${cmd} i`, {
    cwd: import_path2.default.join(process.cwd(), projectName)
  });
  await execAsyncWithDebug(`${cmd} add -D @types/node`, {
    cwd: import_path2.default.join(process.cwd(), projectName)
  });
  await installEslintDevDeps(pkgManager, projectName, "vite");
}
async function createNextApp(projectName, pkgManager) {
  const cmd = pkgManager === "npm" ? "npx create-next-app@latest" : `${pkgManager} create next-app`;
  await execAsyncWithDebug(
    `${cmd} ${projectName} --ts --no-linter --react-compiler --tailwind --src-dir --app --turbopack --import-alias "@/*"`
  );
  await installUltracite(pkgManager, projectName);
}
async function createSE2(projectName) {
  const projectDirectory = import_path2.default.join(process.cwd(), projectName);
  await execAsyncWithDebug(
    `git clone https://github.com/scaffold-eth/scaffold-eth-2.git ${projectName}`,
    {
      cwd: projectDirectory
    }
  );
  const origen = getSourcePath("templates", "web3", "se2-w");
  await (0, import_promises3.cp)(`${origen}/package.json`, `${projectDirectory}/package.json`);
  await (0, import_promises3.cp)(`${origen}/start-dev.ps1`, `${projectDirectory}/start-dev.ps1`);
  const packageJsonDir = import_path2.default.join(projectDirectory, "package.json");
  const data = await (0, import_promises3.readFile)(packageJsonDir, "utf8");
  const draft = data.replace(/{{\s*projectName\s*}}/g, projectName);
  await (0, import_promises3.writeFile)(packageJsonDir, draft, "utf8");
  await execAsyncWithDebug("yarn install", {
    cwd: projectDirectory
  });
}

// src/helpers/gitUtils.ts
var import_path3 = __toESM(require("path"));
async function makeCommit(projectName) {
  const projectDirectory = import_path3.default.join(process.cwd(), projectName);
  await execAsyncWithDebug('git commit --amend -m  "Initial commit from Create Manu App"', {
    cwd: projectDirectory
  });
  await execAsyncWithDebug('git add ."', {
    cwd: projectDirectory
  });
  await execAsyncWithDebug('git commit -m  "Initial commit from Create Manu App"', {
    cwd: projectDirectory
  });
}

// src/index.ts
var TEMPLATES_WEB2 = [
  {
    label: "Next.js + Ultracite + TypeScript + Shadcn/ui",
    value: "next-shadcn"
  },
  {
    label: "Next.js + Ultracite + TypeScript + Tailwind",
    value: "next-tw"
  },
  {
    label: "React (vite) + ESLint + TypeScript + Shadcn/ui",
    value: "react-vite-shadcn"
  }
];
var TEMPLATES_WEB3 = [
  {
    label: "Next.js + ESLint + TypeScript + Shadcn/ui + RainbowKit",
    value: "next-rainbowkit"
  },
  {
    label: "Scaffold-Eth-2 Windows: Updated toolkit for building Ethereum dapps with Next.js.",
    value: "se2-w"
  }
];
var s = (0, import_prompts.spinner)();
async function main() {
  const argv = await (0, import_yargs.default)((0, import_helpers.hideBin)(process.argv)).argv;
  (0, import_prompts.intro)(import_picocolors.default.bold(import_picocolors.default.white(" Assistant to create a project as Manu would ")));
  const promptsGroup = await (0, import_prompts.group)(
    {
      projectName: () => (0, import_prompts.text)({
        message: import_picocolors.default.cyan("Project name:"),
        placeholder: "my-app",
        validate(value) {
          if (value.length === 0) return `Name is required!`;
          if (value.match(/[^a-zA-Z0-9-_]+/g))
            return "Project name can only contain letters, numbers, dashes and underscores";
        }
      }),
      projectType: () => (0, import_prompts.select)({
        message: import_picocolors.default.cyan("Select a project type."),
        initialValue: "web2",
        options: [
          { value: "web2", label: "\u{1F4BB} Web 2" },
          { value: "web3", label: "\u{1F310} Web 3" }
        ]
      }),
      template: ({ results: { projectType: projectType2 } }) => (0, import_prompts.select)({
        message: import_picocolors.default.cyan("Select a template."),
        initialValue: projectType2 === "web2" ? TEMPLATES_WEB2[0].value : TEMPLATES_WEB3[0].value,
        options: projectType2 === "web2" ? TEMPLATES_WEB2 : TEMPLATES_WEB3
      })
    },
    {
      onCancel: () => {
        (0, import_prompts.cancel)("Cancelled.");
        process.exit(0);
      }
    }
  );
  const { projectName, projectType, template } = promptsGroup;
  let pkgManager = getPkgManager(argv);
  if (template === "se2-w") {
    if (pkgManager !== "yarn") {
      const shouldChangePkgManager = await (0, import_prompts.confirm)({
        message: import_picocolors.default.bold(import_picocolors.default.italic(import_picocolors.default.yellow("Scaffold-Eth-2 only supports yarn")))
      });
      if (!shouldChangePkgManager) {
        (0, import_prompts.outro)(import_picocolors.default.bold(import_picocolors.default.italic(import_picocolors.default.red("Cancelled"))));
        process.exit(0);
      }
      const yarnIsInstalled = await checkIfYarnIsInstalled();
      if (!yarnIsInstalled) {
        (0, import_prompts.outro)(import_picocolors.default.bold(import_picocolors.default.italic(import_picocolors.default.red("Yarn is not installed"))));
        process.exit(1);
      }
      pkgManager = "yarn";
    }
    s.start(import_picocolors.default.yellow("\u{1F680} Creating Scaffold-Eth-2 project"));
    await createSE2(projectName);
    s.stop(import_picocolors.default.green("\u{1F680} Successfully Scaffold-Eth-2 project created!"));
  }
  if (template.includes("next")) {
    s.start(import_picocolors.default.yellow("\u{1F680} Creating Next project"));
    await createNextApp(projectName, pkgManager);
    s.stop(import_picocolors.default.green("\u{1F680} Successfully Next project created!"));
    if (template === "next-rainbowkit") {
      s.start(import_picocolors.default.yellow("\u{1F308} Installing RainbowKit"));
      await installRainbowKit(projectName, pkgManager);
      s.stop(import_picocolors.default.green("\u{1F308} RainbowKit successfully installed!"));
    }
    if (template === "next-shadcn") {
      s.start(import_picocolors.default.yellow("\u{1F9E9} Installing Shadcn"));
      await installShadcn(projectName, template, pkgManager);
      s.stop(import_picocolors.default.green("\u{1F9E9} Shadcn successfully installed!"));
    }
    s.start(import_picocolors.default.yellow("\u{1F4C1} Configuring files"));
    await replaceFiles(projectName, projectType, template);
    s.stop(import_picocolors.default.green("\u{1F4C1} Files configured successfully!"));
    s.start(import_picocolors.default.yellow("\u{1F4DD} Adding ultracite scripts"));
    await addUltraciteScripts(projectName, pkgManager);
    s.stop(import_picocolors.default.green("\u{1F4DD} Ultracite scripts added successfully!"));
    s.start(import_picocolors.default.yellow("\u{1F5D1}\uFE0F Removing unnecessary files"));
    await removeFiles(projectName, template);
    s.stop(import_picocolors.default.green("\u{1F5D1}\uFE0F Unnecessary files deleted correctly!"));
    if (template.includes("next")) {
      await fixUltraciteErrors(projectName, pkgManager);
    }
    await makeCommit(projectName);
  }
  if (template.includes("vite")) {
    s.start(import_picocolors.default.yellow("\u{1F680} Creating Vite React project"));
    await createViteReactApp(projectName, pkgManager);
    s.stop(import_picocolors.default.green("\u{1F680} Successfully Vite React project created!"));
    s.start(import_picocolors.default.yellow("\u{1F3A8} Installing Tailwind"));
    await installTailwindAndInit(pkgManager, projectName);
    s.stop(import_picocolors.default.green("\u{1F3A8} Tailwind successfully installed!"));
    s.start(import_picocolors.default.yellow("\u{1F4C1} Configuring files"));
    await replaceFiles(projectName, projectType, template);
    s.stop(import_picocolors.default.green("\u{1F4C1} Files configured successfully!"));
    s.start(import_picocolors.default.yellow("\u{1F9E9} Installing Shadcn"));
    await installShadcn(projectName, template, pkgManager);
    s.stop(import_picocolors.default.green("\u{1F9E9} Shadcn successfully installed!"));
    s.start(import_picocolors.default.yellow("\u{1F5D1}\uFE0F Removing unnecessary files"));
    await removeFiles(projectName, template);
    s.stop(import_picocolors.default.green("\u{1F5D1}\uFE0F Unnecessary files deleted correctly!"));
  }
  const command = `${pkgManager} ${pkgManager === "npm" ? "run dev" : "dev"}`;
  const message = `
\u{1F449} To get started, run ${import_picocolors.default.italic(
    `cd ${projectName}`
  )} and then ${import_picocolors.default.italic(command)}`;
  console.log(import_picocolors.default.white(message));
  (0, import_prompts.outro)(import_picocolors.default.bold(import_picocolors.default.italic(import_picocolors.default.white(" Let's do great things! \u{1F300} "))));
  process.exit(0);
}
main().catch(console.error);
//# sourceMappingURL=index.js.map