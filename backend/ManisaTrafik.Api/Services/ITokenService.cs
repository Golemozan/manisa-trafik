using ManisaTrafik.Api.Models;

namespace ManisaTrafik.Api.Services;

public interface ITokenService
{
    string CreateToken(User user);
}