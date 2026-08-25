# Steps to generate ts bindings

```bash
cd ../komorebi-server && cargo ts-rs
```

## Optional Configuration

To configure where bindings are generated, modify the `.cargo/config.toml` file
in the `komorebi-server` directory to edit the following configuration:

```toml
# ...
[env]
TS_RS_EXPORT_DIR = { value = "../komorebi-web/src/lib/models/bindings/", relative = true }
# ...
```

or set the environment variable `TS_RS_EXPORT_DIR` to the desired path before
running the command.
