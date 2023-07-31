# Contributing to Paziresh24 / Patient Front-end

Thank you for considering contributing to the Paziresh24 - Patient Front-end! By contributing, you become part of a community dedicated to revolutionizing healthcare services and making a positive impact on patients' lives. Whether you're a seasoned developer or just starting, your contributions are highly valued and appreciated.

To ensure a smooth and collaborative process, please follow these guidelines when contributing to the project:

## Developing
The development branch is `master`. This is the branch that all pull
requests should be made against. The changes on the `master`
branch are tagged into a release monthly.

To develop locally:

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your
   own GitHub account and then
   [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Create a new branch:

   ```sh
   git checkout -b MY_BRANCH_NAME
   ```

3. Install the dependencies with:

   ```sh
   npm install
   ```

4. Set up your `.env` file:

   - Duplicate `.env.example` to `.env`.
 
5. Start developing and watch for code changes:

   ```sh
   npm run dev
   ```

## Building

You can build the project with:

```bash
npm run build
```

Please be sure that you can make a full production build before pushing code.

## Linting

To check the formatting of your code:

```sh
npm run lint
```

If you get errors, be sure to fix them before committing.

## Making a Pull Request

1. **Push to Your Fork:** Push your changes to your forked repository

2. **Open a Pull Request:** Go to the original project repository on GitHub and click the "Compare & pull request" button. Provide a detailed description of your changes, including the problem solved and any additional context.

3. **Review Process:** The project maintainers will review your PR, provide feedback, and request any necessary changes. Please be patient during this process, as it may take some time.

4. **Merge Your Contribution:** Once your PR is approved and all checks pass, it will be merged into the `master` branch, and your changes will become a part of the project.

## Reporting Issues

If you encounter any bugs or have suggestions for improvements, feel free to create a new topic on the community. Provide as much detail as possible to help the community understand the problem or suggestion better.

## Code Style and Guidelines

- Follow the coding style and guidelines already established in the project to maintain code consistency.

- Write clean and readable code with appropriate comments and documentation to help other contributors understand your changes.

- Use meaningful names for variables, functions, and components to improve code readability.



## Troubleshooting
- ### "Your connection is not private"

    You can either grant a temporary exception in your browser, or create and install a local certificate and use your OS to mark them as "trusted". The instructions below will show you how to create and install a local certificate.
    
    We will be using [mkcert](https://github.com/FiloSottile/mkcert) to create and install a locally-trusted, development certificate. The following will install `mkcert` and then create and install the local certificates.
    
    ```shell
    brew install mkcert
    npm run mkcert-localhost
    ```
    
    You can now run the dev server with `npm run dev` and open [https://localhost:8766](https://localhost:8766). There should not see a warning about your connection not being private. You should also see a lock or similar icon in the address bar of your browser.
