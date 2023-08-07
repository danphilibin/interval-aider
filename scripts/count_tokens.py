import tiktoken


def num_tokens_from_string(string: str, encoding_name: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens


def num_tokens_from_file(file_name: str, encoding_name: str) -> int:
    """Returns the number of tokens in a text file."""
    encoding = tiktoken.get_encoding(encoding_name)
    with open(file_name, "r") as file:
        text = file.read()
    num_tokens = num_tokens_from_string(text, encoding_name)
    return num_tokens


print(
    "Approx. number of tokens in the Interval documentation: "
    + str(num_tokens_from_file("./DOCS.md", "cl100k_base"))
)
