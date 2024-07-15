package com.aa.msw.api.user;

import com.aa.msw.database.repository.dao.UserDao;
import com.aa.msw.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserApiService {
    private final UserDao userDao;

    public UserApiService(UserDao userDao) {
        this.userDao = userDao;
    }

    public boolean isUserPresent(User user) {
        return userDao.find(user.userId()).isPresent();
    }
}
