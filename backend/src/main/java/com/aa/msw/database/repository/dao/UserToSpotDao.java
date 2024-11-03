package com.aa.msw.database.repository.dao;

import com.aa.msw.database.helpers.UserToSpot;
import com.aa.msw.database.helpers.id.SpotId;
import com.aa.msw.database.helpers.id.UserToSpotId;
import com.aa.msw.model.Spot;
import com.aa.msw.model.UserSpot;

import java.util.List;

public interface UserToSpotDao extends Dao<UserToSpotId, UserToSpot> {

    void addAllPublicSpotsToUser();

    void addPrivateSpot(Spot spot, int position);

    void setPosition(SpotId spotId, int position);

    void deletePrivateSpot(SpotId spotId);

    List<UserSpot> getUserSpotsOrdered();

    void updatePrivateSpot(Spot updatedSpot);
}
